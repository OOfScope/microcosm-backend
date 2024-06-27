import { Client as LibsqlClient, createClient } from "@libsql/client/web";
import { Router, RouterType } from "itty-router";
import { encode, decode } from "@cfworker/base64url"


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
    

    router.get("/parse_jwt/user_data/:token",  async (request) => {
        // const token = request.params.token;
        // console.log(token);
        const token =  request.params.token
        // const decoded = decode(token);
        const parts = token.split('.');
        const payload = decode(parts[1]);

        const parsed = JSON.parse(payload);
        const email = parsed['email'];
        const country = parsed['country'];
        return Response.json({ email, country }, { status: 200 });

    });


    router.get("/parse_jwt/:token",  async (request) => {

        const token =  request.params.token

        const parts = token.split('.');
        const header = decode(parts[0]);
        const payload = decode(parts[1]);
        // const signature = atob(parts[2].replace(/_/g, '/').replace(/-/g, '+'));


        return Response.json({ header: header, payload: payload }, { status: 200 });

    });




    router.get("/get/high/random/image",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select image_base64 from images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });        

    router.get("/get/high/random/mask",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select mask_base64 from images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });        

    router.get("/get/high/random/cmap",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select cmap_base64 from images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });
        
    router.get("/get/high/random",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select * from images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });
        
    router.get("/high/count",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select count(id) from images_dataset");
        return Response.json(rs, { status: 200 });
    });

    router.get("/low/count",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select count(id) from low_images_dataset");
        return Response.json(rs, { status: 200 });
    });

    router.get("/get/low/random/image",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select image_base64 from low_images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });        

    router.get("/get/low/random/mask",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select mask_base64 from low_images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });        

    router.get("/get/low/random/cmap",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select cmap_base64 from low_images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });
        

    router.get("/get/low/random",  async () => {
        const client = buildLibsqlClient(env);
        const rs = await client.execute("select * from low_images_dataset order by RANDOM() limit 1");
        return Response.json(rs, { status: 200 });
    });


    router.get("/get/high/:id/image",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select image_base64 from images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });

    router.get("/get/high/:id/mask",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select mask_base64 from images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });
    
    router.get("/get/high/:id/cmap",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select cmap_base64 from images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });
    
    router.get("/get/high/:id",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select * from images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });



    router.get("/get/low/:id/image",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select image_base64 from low_images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });

    router.get("/get/low/:id/mask",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select mask_base64 from low_images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });
    
    router.get("/get/low/:id/cmap",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select cmap_base64 from low_images_dataset where id = " + id);
        return Response.json(rs, { status: 200 });
    });


    router.get("/get/low/:id",  async (request) => {
        const client = buildLibsqlClient(env);
        const id = request.params.id;
        const rs = await client.execute("select * from low_images_dataset where id = " + id);
    });



    router.get("/",  async () => {

        const rs = 'Welcome in the Microcosm Backend :)'
        return Response.json(rs, { status: 200 });
    });


    router.all("*", () => new Response("Not Found.", { status: 404 }));

    return router;
}
