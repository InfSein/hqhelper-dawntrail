import { createAlova } from "alova";
import { useRequest } from "alova/client";
import adapterFetch from "alova/fetch";
import vueHook from "alova/vue";


export const alovaApi = createAlova({
    baseURL: 'https://cloud.nbb.ffxiv.cn',
    statesHook: vueHook,
    requestAdapter: adapterFetch(),
    beforeRequest(method) {
        if (!method.meta?.ignoreToken) {
            method.config.headers.authorization = localStorage.getItem('nbb-cloud-token');
        }
    },
    responded: (res) => {
        if (res.status >= 400) {
            throw Promise.reject(new Error('请求失败:' + res.statusText));
        }
        return res.json();
    }
});


