// import { aj } from "@/config/Arcjet";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const user = await currentUser();
//   const { token } = await req.json();

//   if (token) {
//     const decision = await aj.protect(req, {
//       userId: user?.primaryEmailAddress.emailAddress,
//       requested: token,
//     }); // Deduct 5 tokens from the bucket
//     if (decision.isDenied()) {
//       return NextResponse.json({
//         error: "Too Many Requests",
//         remainingToken: decision.reason.remaining,
//       });
//     }
//     return NextResponse.json({
//       allowed: true,
//       remainingToken: decision.reason.remaining,
//     });
//   } else {
//     const decision = await aj.protect(req, {
//       userId: user?.primaryEmailAddress.emailAddress,
//       requested: 0,
//     }); // Deduct 5 tokens from the bucket
//     console.log("Arcjet decision", decision, decision.reason.remaining);
//     const remainingToken = decision.reason.remaining;

//     return NextResponse.json({ remainingToken: remainingToken });
//   }
// }

import { aj } from "@/config/Arcjet";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET handler - Check remaining tokens without deducting
export async function GET(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decision = await aj.protect(req, {
      userId: user.primaryEmailAddress.emailAddress,
      requested: 0, // Just check, don't deduct
    });

    console.log("Arcjet decision", decision, decision.reason.remaining);

    return NextResponse.json({
      remainingToken: decision.reason.remaining,
    });
  } catch (error) {
    console.error("Error in GET /api/user-remaining-msg:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler - Deduct tokens when sending a message
export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token = 1 } = await req.json();

    const decision = await aj.protect(req, {
      userId: user.primaryEmailAddress.emailAddress,
      requested: token, // Deduct the specified amount
    });

    console.log("Token deduction:", decision, decision.reason.remaining);

    if (decision.isDenied()) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          remainingToken: 0,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      remainingToken: decision.reason.remaining,
    });
  } catch (error) {
    console.error("Error in POST /api/user-remaining-msg:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
