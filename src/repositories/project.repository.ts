import { prisma } from '../lib/prisma';
import { CreateProjectDTO } from '../dtos/project.dto';

export interface ProjectFilterOptions {
  profileId?: string;
  technology?: string;
  skip?: number;
  take?: number;
}

export class ProjectRepository {
  async create(data: CreateProjectDTO) {
    const technologyConnect =
      data.technologyIds && data.technologyIds.length > 0
        ? { connect: data.technologyIds.map((id) => ({ id })) }
        : undefined;

    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        repositoryUrl: data.repositoryUrl || null,
        liveUrl: data.liveUrl || null,
        profileId: data.profileId,
        upvotes: 0,
        averageRating: 0,
        technologies: technologyConnect,
      },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technologies: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        feedbacks: true,
      },
    });
  }

  async findAll(options: ProjectFilterOptions = {}) {
    const { profileId, technology, skip, take } = options;

    const where: any = {};

    if (profileId) {
      where.profileId = profileId;
    }

    if (technology && technology.trim().length > 0) {
      const techTerm = technology.trim();
      where.technologies = {
        some: {
          OR: [
            { id: techTerm },
            { name: { contains: techTerm, mode: 'insensitive' } },
          ],
        },
      };
    }

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take,
        include: {
          profile: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          technologies: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          feedbacks: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, projects };
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            githubUrl: true,
          },
        },
        technologies: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        feedbacks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async incrementUpvote(id: string) {
    return prisma.project.update({
      where: { id },
      data: {
        upvotes: { increment: 1 },
      },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technologies: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        feedbacks: true,
      },
    });
  }

  async updateAverageRating(id: string, averageRating: number) {
    return prisma.project.update({
      where: { id },
      data: {
        averageRating,
      },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        technologies: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        feedbacks: true,
      },
    });
  }
}

export const projectRepository = new ProjectRepository();
