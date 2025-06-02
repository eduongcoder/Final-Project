package com.example.demo.config;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

@Component
public class RolePermissionResolver {
	private final SecurityProperties properties;
    private final Map<String, Set<String>> resolvedRolePermissions = new HashMap<>();

    public RolePermissionResolver(SecurityProperties properties) {
        this.properties = properties;
        resolvePermissions();
    }

    private void resolvePermissions() {
        Map<String, List<String>> allPermissions = properties.getPermission();
        Map<String, List<String>> roleDefinitions = properties.getRoles();

        for (Map.Entry<String, List<String>> roleEntry : roleDefinitions.entrySet()) {
            String role = roleEntry.getKey();
            Set<String> resolvedEndpoints = new HashSet<>();

            for (String permKey : roleEntry.getValue()) {
                List<String> endpoints = allPermissions.getOrDefault(permKey, List.of());
                resolvedEndpoints.addAll(endpoints);
            }
            resolvedRolePermissions.put(role, resolvedEndpoints);
        }
    }

    public Set<String> getEndpointsForRole(String role) {
        Set<String> endpoints = new HashSet<>();

        List<String> groups = properties.getRoles().get(role);
        
        if (groups == null) return endpoints;
       
        for (String group : groups) {
            List<String> perms = properties.getPermission().get(group);
            if (perms != null) {
//            	log.info(role+" gì dị:"+perms.toString());

                endpoints.addAll(perms);
            }
        }

        return endpoints;
    }

    public List<String> getWhitelist() {
        return properties.getWhitelist();
    }
}
