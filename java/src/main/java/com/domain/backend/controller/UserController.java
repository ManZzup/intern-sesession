package com.domain.backend.controller;

import java.util.Calendar;
import java.util.Date;

import javax.servlet.ServletException;

import com.domain.backend.dto.UserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.domain.backend.model.User;
import com.domain.backend.service.UserService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@CrossOrigin(origins = "http://localhost", maxAge = 3600)
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public UserDTO registerUser(@RequestBody UserDTO user) {
        return userService.save(user);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(@RequestBody UserDTO userDTO) throws ServletException {

        String jwtToken = "";

        if (userDTO.getUserName() == null || userDTO.getPassword() == null) {
            throw new ServletException("Please fill in username and password");
        }

        boolean isLoginSuccessfully = userService.checkLoginUser(userDTO);
        if (isLoginSuccessfully) {
            Calendar cal = Calendar.getInstance();
            cal.roll(Calendar.MINUTE, 1);

            //without expiration time
            jwtToken = Jwts.builder().setSubject(userDTO.getUserName()).claim("roles", "user").setIssuedAt(new Date()).setExpiration(cal.getTime())
                    .signWith(SignatureAlgorithm.HS256, "secretkey").compact();

//            //with expiration time
//            jwtToken = Jwts.builder().setSubject(userDTO.getUserName()).claim("roles", "user").setIssuedAt(new Date()).setExpiration(cal.getTime())
//                    .signWith(SignatureAlgorithm.HS256, "secretkey").compact();

            userService.updateToken(userDTO.getUserName(), jwtToken);
            return jwtToken;
        } else {
            return "wrong credentials";
        }
    }

    @RequestMapping(value = "/validate", method = RequestMethod.GET)
    public Boolean validateToken(@RequestParam String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey("secretkey").parseClaimsJws(token);

            if (claims != null) {
                return userService.checkUserTokenMatch(claims.getBody().getSubject(), token);
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    @RequestMapping(value = "/revoke", method = RequestMethod.GET)
    public Boolean revokeToken(@RequestParam String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey("secretkey").parseClaimsJws(token);

            if (claims != null) {
                userService.updateToken(claims.getBody().getSubject(), null);
                return true;
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

}
