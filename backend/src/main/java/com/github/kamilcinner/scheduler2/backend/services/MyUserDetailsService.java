package com.github.kamilcinner.scheduler2.backend.services;

import com.github.kamilcinner.scheduler2.backend.models.MyUserDetails;
import com.github.kamilcinner.scheduler2.backend.models.User;
import com.github.kamilcinner.scheduler2.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);

        user.orElseThrow(() -> new UsernameNotFoundException("Not found user: " + username));

        return user.map(MyUserDetails::new).get();
    }
}
