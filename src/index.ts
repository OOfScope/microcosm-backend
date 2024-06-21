import { Client as LibsqlClient, createClient } from "@libsql/client/web";
import { Router, RouterType } from "itty-router";

export interface Env {
    LIBSQL_DB_URL?: string;
    LIBSQL_DB_AUTH_TOKEN?: string;
    router?: RouterType;
}

export default {
    async fetch(request, env): Promise<Response> {
        if (env.router === undefined) {
            env.router = buildRouter(env);
        }
        return env.router.handle(request);
    },
} satisfies ExportedHandler<Env>;


function buildLibsqlClient(env: Env): LibsqlClient {
    const url = env.LIBSQL_DB_URL?.trim();
    if (url === undefined) {
        throw new Error("LIBSQL_DB_URL env var is not defined");
    }

    const authToken = env.LIBSQL_DB_AUTH_TOKEN?.trim();
    if (authToken === undefined) {
        throw new Error("LIBSQL_DB_AUTH_TOKEN env var is not defined");
    }

    return createClient({ url, authToken });
}

function buildRouter(env: Env) {
    const router = Router();
    


    router.get("/random/image",  async (request) => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select image_base64 from images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });        

    router.get("/random/mask",  async (request) => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select mask_base64 from images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });        

    router.get("/random/cmap",  async (request) => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select cmap_base64 from images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });
        
    router.get("/random",  async (request) => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select * from images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });
        
    router.get("/count",  async (request) => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select count(id) from images_dataset");
        return Response.json(rs, { status: 200 });
    });

    router.get("/:id",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select * from images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });

    router.get("/:id/image",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select image_base64 from images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });

    router.get("/:id/mask",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select mask_base64 from images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });
    
    router.get("/:id/cmap",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select cmap_base64 from images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });


    router.all("*", () => new Response("Not Found.", { status: 404 }));

    return router;
}