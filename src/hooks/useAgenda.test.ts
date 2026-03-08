import { renderHook, act } from "@testing-library/react";
import { useAgenda } from "./useAgenda";
import { AgendaService } from "@/services/agenda.service";
import { useLoadingStore } from "@/stores/loading.store";
import { useAlertStore } from "@/stores/alert.store";

jest.mock("@/services/agenda.service");
jest.mock("@/stores/loading.store");
jest.mock("@/stores/alert.store");

describe("useAgenda", () => {
  const show = jest.fn();
  const hide = jest.fn();
  const alertShow = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useLoadingStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ show, hide })
    );

    (useAlertStore.getState as jest.Mock) = jest.fn().mockReturnValue({
      show: alertShow,
    });
  });

  it("fetches agenda", async () => {
    const mockData = [{ id: 1, name: "Teste" }];

    (AgendaService.list as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useAgenda());

    await act(async () => {
      await result.current.fetch();
    });

    expect(show).toHaveBeenCalled();
    expect(hide).toHaveBeenCalled();
    expect(result.current.agenda).toEqual(mockData);
  });

  it("creates appointment", async () => {
    (AgendaService.create as jest.Mock).mockResolvedValue({});
    (AgendaService.list as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useAgenda());

    await act(async () => {
      await result.current.create({
        name: "joao",
      } as any);
    });

    expect(AgendaService.create).toHaveBeenCalled();
    expect(alertShow).toHaveBeenCalledWith({
      message: "Agendamento criado com sucesso!",
      variant: "success",
    });
  });

  it("updates appointment", async () => {
    const updated = { id: 1, name: "Joao" };

    (AgendaService.update as jest.Mock).mockResolvedValue(updated);
    (AgendaService.list as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useAgenda());

    let response;

    await act(async () => {
      response = await result.current.update({
        id: 1,
        name: "joao",
      } as any);
    });

    expect(AgendaService.update).toHaveBeenCalled();
    expect(response).toEqual(updated);
  });

  it("removes appointment", async () => {
    (AgendaService.remove as jest.Mock).mockResolvedValue({});
    (AgendaService.list as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useAgenda());

    await act(async () => {
      await result.current.remove(1);
    });

    expect(AgendaService.remove).toHaveBeenCalledWith(1);
    expect(alertShow).toHaveBeenCalledWith({
      message: "Agendamento excluído com sucesso!",
      variant: "success",
    });
  });
});