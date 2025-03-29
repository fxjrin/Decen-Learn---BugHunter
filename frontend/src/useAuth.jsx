import React, { useState, useEffect, useCallback } from "react";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId } from "declarations/backend";

const network = process.env.DFX_NETWORK;
const identityProvider = "https://identity.ic0.app";

export const useAuth = ({ state, setState }) => {
  const [authClient, setAuthClient] = useState(null);
  const [principal, setPrincipal] = useState(null);

  const createAuthenticatedActor = async (authClient) => {
    const isAuthenticated = authClient? await authClient.isAuthenticated() : false;
    const identity = isAuthenticated ? await authClient.getIdentity() : undefined;

    return createActor(canisterId, {
      agentOptions: { identity },
    });
  };

  const updateAuthState = async () => {
    try {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);

      const actor = await createAuthenticatedActor(authClient);
      const isAuthenticated = await authClient.isAuthenticated();
      const principal = isAuthenticated
        ? (await authClient.getIdentity()).getPrincipal().toText()
        : null;
      setPrincipal(principal);

      setState((prev) => ({
        ...prev,
        isAuthenticated,
        actor,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error updating auth state:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    updateAuthState();
  }, []);

  const login = async () => {
    if (!authClient) return;

    try {
      await authClient.login({
        identityProvider,
        onSuccess: async () => {
        await updateAuthState()
        await loadUser();
      },
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      updateAuthState();

      setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      user: null,
      oldUsername: null,
      isLoading: false,
    }));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const loadUser = useCallback(async () => {
    if (!state.isAuthenticated || !state.actor || !principal) return;

    try {
      const principalId = Principal.fromText(principal);
      let userData = await state.actor.getUserByPrincipal(principalId);

      if (!userData?.length) {
        await state.actor.authenticateUser(principal.slice(0, 8));
        userData = await state.actor.getUserByPrincipal(principalId);
      }

      setState((prev) => ({
        ...prev,
        oldUsername: prev.user?.username,
        user: userData?.[0] || null,
      }));
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  }, [state.isAuthenticated, state.actor, principal]);

  return { principal, login, logout, loadUser };
};
