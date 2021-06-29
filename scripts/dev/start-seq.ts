import { HostClient } from "@scramjet/api-client/";
import { createReadStream } from "fs";
import { resolve } from "path";
const host = new HostClient("http://localhost:8000/api/v1");

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const pkg = createReadStream(resolve(__dirname, "../../packages/samples/hello-alice-out.tar.gz"));
    const sequence = await host.sendSequence(pkg);

    console.log((await sequence.getInfo()).data);

    const instance = await sequence.start({}, ["/package/data.json"]);
    const instanceInfo = (await instance.getInfo()).data;

    console.log(instanceInfo);
})();
