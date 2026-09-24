import { prisma } from '../lib/prisma';
import { CreateFeedbackDTO } from '../dtos/feedback.dto';

export class FeedbackRepository {
  async create(data: CreateFeedbackDTO) {
    return prisma.feedback.create({
      data: {
        author: data.author,
        content: data.content,
        rating: data.rating,
        projectId: data.projectId,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async findByProjectId(projectId: string) {
    return prisma.feedback.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return prisma.feedback.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async calculateAverageRating(projectId: string): Promise<{ average: number; count: number }> {
    const aggregate = await prisma.feedback.aggregate({
      where: { projectId },
      _avg: { rating: true },
      _count: { _all: true },
    });

    const average = aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(2)) : 0;
    const count = aggregate._count._all;

    return { average, count };
  }
}

export const feedbackRepository = new FeedbackRepository();
