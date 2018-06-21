package com.domain.backend.service;

import com.domain.backend.dto.UserDTO;
import com.domain.backend.model.User;

public interface UserService {
	UserDTO save(UserDTO user);

	boolean checkLoginUser(UserDTO userDTO);

	void updateToken(String userName,String token);

	boolean checkUserTokenMatch(String userName,String token);
}
