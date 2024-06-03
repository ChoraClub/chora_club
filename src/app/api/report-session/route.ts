import { connectDB } from "@/config/connectDB";
import { NextResponse, NextRequest } from "next/server";

export interface Report {
  report_id: string;
  user_wallet_address: string;
  report_type: string;
  description: string;
  timestamp: number;
  status: string;
  admin_notes: string;
}

export type Reports = Array<Report>;

export interface VideoReport {
  report_counts?: number;
  reports: Reports;
}

// Define the request body type
export interface ReportRequestBody {
  meetingId: string;
  host_address: string;
  video_reports: VideoReport;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { meetingId, host_address, video_reports }: ReportRequestBody =
    await req.json();

  if (!meetingId || !host_address || !video_reports || !video_reports.reports) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection("meetings");

    const existingDocument = await collection.findOne({
      meetingId,
      host_address,
    });

    if (!existingDocument) {
      client.close();
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const userWalletAddresses = video_reports.reports.map(
      (report) => report.user_wallet_address
    );
    const existingReports = existingDocument.video_reports?.reports || [];

    const userAlreadyReported = existingReports.some(
      (report: { user_wallet_address: string }) =>
        userWalletAddresses.includes(report.user_wallet_address)
    );

    if (userAlreadyReported) {
      client.close();
      return NextResponse.json(
        { exists: true, error: "User already reported the session before" },
        { status: 400 }
      );
    }

    if (existingDocument.video_reports) {
      await collection.updateOne(
        { meetingId, host_address },
        {
          /*@ts-ignore*/
          $push: {
            "video_reports.reports": { $each: video_reports.reports },
          },
        }
      );
    } else {
      await collection.updateOne(
        { meetingId, host_address },
        { $set: { video_reports } }
      );
    }

    client.close();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error storing meeting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
