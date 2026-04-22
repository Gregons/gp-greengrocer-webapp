package com.cg_project.ecommerce_backend.service;

import com.cg_project.ecommerce_backend.dto.*;
import com.cg_project.ecommerce_backend.entity.Customer;
import com.cg_project.ecommerce_backend.entity.Order;
import com.cg_project.ecommerce_backend.entity.OrderItem;
import com.cg_project.ecommerce_backend.repository.CustomerRepository;
import com.cg_project.ecommerce_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ── Auth ──────────────────────────────────────────────────────────────────

    public LoginResponse register(RegisterRequest request) {
        if (customerRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email address is already registered");
        }
        Customer customer = new Customer();
        customer.setName(request.name());
        customer.setEmail(request.email());
        customer.setPassword(passwordEncoder.encode(request.password()));
        String token = UUID.randomUUID().toString();
        customer.setSessionToken(token);
        customerRepository.save(customer);
        return new LoginResponse(customer.getId(), customer.getName(), customer.getEmail(), token);
    }

    public LoginResponse login(LoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "This account does not exist, please register"));
        if (!passwordEncoder.matches(request.password(), customer.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect email or password");
        }
        // Rotate the session token on every login
        String token = UUID.randomUUID().toString();
        customer.setSessionToken(token);
        customerRepository.save(customer);
        return new LoginResponse(customer.getId(), customer.getName(), customer.getEmail(), token);
    }

    // ── Token validation ──────────────────────────────────────────────────────

    public Customer validateToken(String bearerHeader) {
        if (bearerHeader == null || !bearerHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid authorisation token");
        }
        String token = bearerHeader.substring(7);
        return customerRepository.findBySessionToken(token)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Session has expired. Please log in again."));
    }

    // ── Orders ────────────────────────────────────────────────────────────────

    public List<OrderResponse> getOrders(String bearerHeader) {
        Customer customer = validateToken(bearerHeader);
        return orderRepository.findByCustomerIdOrderByOrderDateDesc(customer.getId())
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    public OrderResponse placeOrder(String bearerHeader, PlaceOrderRequest request) {
        Customer customer = validateToken(bearerHeader);

        Order order = new Order();
        order.setOrderId("ORD-" + System.currentTimeMillis());
        order.setOrderDate(LocalDateTime.now());
        order.setTotal(BigDecimal.valueOf(request.total()));
        order.setCustomer(customer);

        List<OrderItem> items = request.items().stream().map(req -> {
            OrderItem item = new OrderItem();
            item.setCatalogueItemId(req.id());
            item.setName(req.name());
            item.setPrice(BigDecimal.valueOf(req.price()));
            item.setQuantity(req.quantity());
            item.setOrder(order);
            return item;
        }).toList();

        order.setItems(items);
        Order saved = orderRepository.save(order);
        return toOrderResponse(saved);
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(i -> new OrderItemResponse(
                        i.getCatalogueItemId(),
                        i.getName(),
                        i.getPrice().doubleValue(),
                        i.getQuantity()))
                .toList();
        return new OrderResponse(
                order.getOrderId(),
                order.getOrderDate().format(DATE_FORMATTER),
                items,
                order.getTotal().doubleValue());
    }
}
