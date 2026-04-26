import { prisma } from "@/lib/prisma";
import { createEmbedding } from "@/lib/ai/embed";

async function main() {
  const gigs = await prisma.gig.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      budget: true,
      college: true,
    },
  });

  console.log(`Found ${gigs.length} gigs to reindex`);

  for (const gig of gigs) {
    try {
      const text = `
Title: ${gig.title}
Description: ${gig.description}
Category: ${gig.category}
Budget: ${gig.budget}
College: ${gig.college}
`;

      const embedding = await createEmbedding(text);

      await prisma.gig.update({
        where: { id: gig.id },
        data: {
          aiGigEmbedding: embedding,
          aiGigUpdatedAt: new Date(),
          aiEmbeddingVersion: "text-embedding-3-small",
        },
      });

      console.log(`✅ Reindexed: ${gig.title}`);
    } catch (error) {
      console.error(`❌ Failed: ${gig.title}`, error);
    }
  }

  console.log("🎉 Done reindexing all gigs");
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());