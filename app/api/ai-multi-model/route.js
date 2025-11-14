// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const { model, msg, parentModel } = await req.json();
//   /* Send POST request using Axios */
//   const response = await axios.post(
//     "https://kravixstudio.com/api/v1/chat",
//     {
//       message: msg, // Messages to AI
//       aiModel: model, // Selected AI model
//       outputType: "text", // 'text' or 'json'
//     },
//     {
//       headers: {
//         "Content-Type": "application/json", // Tell server we're sending JSON
//         Authorization: "Bearer " + process.env.KRAVIXSTUDIO_API_KEY, // Replace with your API key
//       },
//     }
//   );

//   console.log(response.data); // Log API response
//   return NextResponse.json({
//     ...response.data,
//     model: parentModel,
//   });
// }

import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  let parentModel = "unknown"; // Declare outside try block for error handling

  try {
    const requestData = await req.json();
    const { model, msg } = requestData;
    parentModel = requestData.parentModel || "unknown";

    // Validate input
    if (!model || !msg || !parentModel) {
      return NextResponse.json(
        {
          error: true,
          aiResponse: "Missing required parameters",
          model: parentModel,
        },
        { status: 400 }
      );
    }

    // Log what we're sending
    console.log(`🔍 Request details for ${parentModel}:`, {
      model,
      parentModel,
      msgType: typeof msg,
      msgLength: Array.isArray(msg) ? msg.length : "not array",
      msgContent: JSON.stringify(msg).substring(0, 100),
    });

    const requestBody = {
      message: msg, // Messages to AI
      aiModel: model, // Selected AI model
      outputType: "text", // 'text' or 'json'
    };

    console.log(
      `📤 Full request body for ${parentModel}:`,
      JSON.stringify(requestBody, null, 2)
    );

    /* Send POST request using Axios */
    const response = await axios.post(
      "https://kravixstudio.com/api/v1/chat",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.KRAVIXSTUDIO_API_KEY,
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log(`✅ ${parentModel} response:`, response.data);

    return NextResponse.json({
      ...response.data,
      model: parentModel,
    });
  } catch (error) {
    console.error(`❌ Error in ai-multi-model API:`, error.message);

    // Handle specific error codes
    if (error.response) {
      const status = error.response.status;
      const statusMessages = {
        402: "Insufficient credits or unsupported model. Please check if the model ID is correct.",
        401: "Invalid API key. Please check your credentials.",
        429: "Rate limit exceeded. Please try again later.",
        500: "AI service is temporarily unavailable. Please try again.",
      };

      const errorMessage =
        statusMessages[status] ||
        `API Error (${status}): ${
          error.response.data?.message || error.message
        }`;

      console.error(`❌ Status ${status} for ${parentModel}:`, {
        status,
        modelUsed: model,
        data: error.response.data,
        headers: error.response.headers,
        requestBody: requestBody,
      });

      return NextResponse.json(
        {
          error: true,
          aiResponse: errorMessage,
          model: error.config?.data
            ? JSON.parse(error.config.data).aiModel
            : "unknown",
          statusCode: status,
          remainingCredits: error.response.data?.remainingCredits || 0,
        },
        { status: status }
      );
    }

    // Handle network errors
    if (error.request) {
      return NextResponse.json(
        {
          error: true,
          aiResponse:
            "Network error: Unable to reach AI service. Please check your connection.",
          model: "unknown",
        },
        { status: 503 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: true,
        aiResponse: `Unexpected error: ${error.message}`,
        model: "unknown",
      },
      { status: 500 }
    );
  }
}
