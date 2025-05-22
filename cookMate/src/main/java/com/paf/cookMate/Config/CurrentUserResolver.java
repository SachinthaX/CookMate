package com.paf.cookMate.Config;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Optional;

@Component
public class CurrentUserResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class) && 
               parameter.getParameterType().equals(String.class);
    }

    // @Override
    // public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
    //                              NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        
    //     HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        
    //     if (request != null) {
    //         Object userId = request.getAttribute("userId");
    //         if (userId != null) {
    //             return userId.toString();
    //         }
            
    //         Cookie[] cookies = request.getCookies();
    //         if (cookies != null) {
    //             Optional<Cookie> userIdCookie = Arrays.stream(cookies)
    //                     .filter(cookie -> "userId".equals(cookie.getName()))
    //                     .findFirst();
                
    //             if (userIdCookie.isPresent()) {
    //                 return userIdCookie.get().getValue();
    //             }
    //         }
    //     }
        
    //     return null;
    // }

    @Override
public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                             NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
    HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);

    if (request != null) {
        Object userId = request.getAttribute("userId");
        if (userId != null) {
            return userId.toString();
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            Optional<Cookie> userIdCookie = Arrays.stream(cookies)
                    .filter(cookie -> "userId".equals(cookie.getName()))
                    .findFirst();

            if (userIdCookie.isPresent()) {
                return userIdCookie.get().getValue();
            }
        }
    }
    // 🚨 If user not found, throw exception (returns 400 Bad Request by default)
    throw new IllegalArgumentException("No authenticated user found in request (attribute/cookie missing)");
}

} 