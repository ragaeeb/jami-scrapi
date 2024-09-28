import vm from 'vm';

export type Sandbox = Record<string, any>;
let sandbox: Sandbox | undefined;

export const runSafely = (jsCode: string): Sandbox => {
    if (!sandbox) {
        sandbox = {};
        vm.createContext(sandbox);
    }

    vm.runInContext(jsCode, sandbox);

    return sandbox;
};
