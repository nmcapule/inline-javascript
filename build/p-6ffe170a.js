import{c as e}from"./p-07d921ae.js";import"./p-14d0ca66.js";const r="executor.worker",t="stencil.executor.worker",o=new URL("p-7e0516d7.js",import.meta.url).href,c=new Blob(['importScripts("'+o+'")'],{type:"text/javascript"}),p=URL.createObjectURL(c),s=e(p,"executor.worker","stencil.executor.worker");URL.revokeObjectURL(p);export{s as worker,t as workerMsgId,r as workerName,o as workerPath}