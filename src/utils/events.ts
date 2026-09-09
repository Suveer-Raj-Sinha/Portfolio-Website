// Centralized Custom Event Dispatcher for Global Decoupled UI Interactions

export function triggerOpenProject(identifier: string | number): void {
  window.dispatchEvent(
    new CustomEvent('open-project-drawer', {
      detail: { identifier },
    }),
  );
}

export function triggerOpenCommandPalette(): void {
  window.dispatchEvent(new CustomEvent('open-command-palette'));
}

export function triggerOpenTerminal(command?: string): void {
  window.dispatchEvent(
    new CustomEvent('open-terminal', {
      detail: command ? { command } : undefined,
    }),
  );
}
