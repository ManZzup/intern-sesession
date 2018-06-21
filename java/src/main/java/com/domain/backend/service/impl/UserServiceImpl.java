package com.domain.backend.service.impl;

import com.domain.backend.dto.UserDTO;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.backend.dao.UserDao;
import com.domain.backend.model.User;
import com.domain.backend.service.UserService;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.ServletException;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;

	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public UserDTO save(UserDTO userDto) {
		User user=new User();
		user.setFirstName(userDto.getFirstName());
		user.setLastName(userDto.getLastName());
		user.setUserName(userDto.getUserName());

		String pwHash= BCrypt.hashpw(userDto.getPassword(),BCrypt.gensalt());
		user.setPassword(pwHash);

		return userDao.save(user).getUserDto();
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public boolean checkLoginUser(UserDTO userDTO) {
		User user=userDao.findByUserName(userDTO.getUserName());

		if (BCrypt.checkpw(userDTO.getPassword(),user.getPassword())) {
			return true;
		}
		return false;
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRED)
	public void updateToken(String userName,String token) {
		User user=userDao.findByUserName(userName);
		user.setToken(token);
	}

	@Override
	@Transactional(propagation = Propagation.SUPPORTS)
	public boolean checkUserTokenMatch(String userName,String token) {
		User user=userDao.findByUserName(userName);
		return user.getToken().equals(token);
	}
}
