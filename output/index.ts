/** 页面A */
interface A {
    /**
     * 页面A的参数name
     */
    name: string;
    /**
     *  页面A的参数age
     */
    age: number;
}

/** 页面B */
interface B {
    /**
     * 页面参数 id
     */
    id: string;
    /**
     * 页面参数 name
     */
    name: number;
}

/** 路由参数映射 */
interface RouterParamsMapping {
    A: A;
    B: B;
}
