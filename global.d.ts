export {};

// Define Emscripten Module interface
interface EmscriptenModule {
  ccall(
    ident: string,
    returnType: 'string' | 'number' | 'boolean' | null,
    argTypes: Array<'string' | 'number' | 'boolean'>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any[],
    options?: { async?: boolean }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any;
}

declare global {
  interface Window {
    onSimUpdate?: (stateFromCpp: {
      totalSteps: number;
      temperature: number;
      pressure: number;
    }) => void;

    Module?: EmscriptenModule;
  }
}
