declare const DEBUG: boolean;
declare module "module" {
  global {
    var __VITE_CONTEXT__: {
      WebSocket: any;
      console: any;
      url: string;
    };
    var __VITE_DEV__;
  }
}
declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        __VITE_MAIN_SCRIPT__?: string;
        __VITE_URL__?: string;
      }
    }
  }
}
process.env;
