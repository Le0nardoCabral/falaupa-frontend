import { create } from "zustand";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { api, HUB_URL } from "../api/client";

export const useFilaStore = create((set, get) => ({
  fila: [],
  connection: null,
  loading: false,
  error: "",
  realtimeConnected: false,

  loadFila: async () => {
    set({ loading: true, error: "" });
    try {
      const { data } = await api.get("/fila");
      set({ fila: data });
    } catch {
      set({ error: "Nao foi possivel carregar a fila." });
    } finally {
      set({ loading: false });
    }
  },

  startRealtime: async () => {
    if (get().connection) return;

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => localStorage.getItem("token") || "" })
      .withAutomaticReconnect()
      .build();

    connection.on("FilaAtualizada", async () => {
      await get().loadFila();
    });

    connection.onreconnected(() => set({ realtimeConnected: true }));
    connection.onreconnecting(() => set({ realtimeConnected: false }));
    connection.onclose(() => set({ realtimeConnected: false }));

    try {
      await connection.start();
      set({ connection, realtimeConnected: true });
    } catch {
      set({ realtimeConnected: false });
    }
  }
}));
