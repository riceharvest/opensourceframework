import { createEdgeRouter } from "@opensourceframework/next-connect";
import nextSession from "@opensourceframework/next-session";
import { NextResponse } from "next/server";

const getSession = nextSession() as any;

const router = createEdgeRouter<Request, { params: any }>();

router.get(async (req) => {
  const res = new NextResponse();
  const session = await getSession.getWebSession(req, res);
  
  // Update session
  session.views = (session.views || 0) + 1;
  session.lastAccess = new Date().toISOString();
  
  await session.commit();
  
  return NextResponse.json({
    message: "Session info from @opensourceframework/next-session",
    session: {
      id: session.id,
      views: session.views,
      lastAccess: session.lastAccess
    },
    modernized: true
  }, {
    headers: res.headers
  });
});

export async function GET(request: Request, ctx: { params: any }) {
  return router.run(request, ctx) as Promise<Response>;
}
