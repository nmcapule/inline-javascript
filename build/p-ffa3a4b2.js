import{c as e}from"./p-45acbf07.js";import"./p-0b4ec935.js";const r="executor.worker",t="stencil.executor.worker",o=new URL("p-8d5902e7.js",import.meta.url).href,c=new Blob(['importScripts("'+o+'")'],{type:"text/javascript"}),p=URL.createObjectURL(c),s=e(p,"executor.worker","stencil.executor.worker");URL.revokeObjectURL(p);export{s as worker,t as workerMsgId,r as workerName,o as workerPath}