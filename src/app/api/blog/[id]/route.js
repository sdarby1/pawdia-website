import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, {params}) {
    const { id } = params;

    try {
        const post = await prisma.blogPost.findUnique({
            where: {id},
            include: {
                categories: true,
                blocks: {
                    orderBy: {order: 'asc'},
                },
                author: {
                    select: { id: true, name: true}
                },
            },
        })

        if (!post) {
            return NextResponse.json({error: 'Post konnte nicht gefunden werden'}, {status: 404})
        }

        return NextResponse.json(post) 
    }
    catch (err) {
        console.error('[BLOG_GET_ERROR]', err)
        return NextResponse.json({error: 'Fehler beim Abrufen des Posts'}, {status: 500})
    }
}