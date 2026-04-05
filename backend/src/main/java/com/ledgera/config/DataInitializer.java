package com.ledgera.config;

import com.ledgera.entity.User;
import com.ledgera.enums.Role;
import com.ledgera.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Profile("!prod")
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ledgera.seed-admin:true}")
    private boolean seedAdmin;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!seedAdmin) {
            logger.info("ℹ️  Admin seed disabled, skipping initialization.");
            return;
        }
        if (!userRepository.existsByEmail("admin@ledgera.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@ledgera.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();

            userRepository.save(admin);
            logger.info("✅ Default admin user created: admin@ledgera.com");
        } else {
            logger.info("ℹ️  Admin user already exists, skipping initialization.");
        }
    }
}
