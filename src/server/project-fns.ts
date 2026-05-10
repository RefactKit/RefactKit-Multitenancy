import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, eq, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { db } from '../../db/index'
import { member, project, projectCategory, projectFile, projectType } from '../../db/schema'
import { auth } from '../../lib/auth'

// --- Types & Schemas ---

export const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  githubUrl: z.string().optional(),
  otherUrl: z.string().optional(),
  organizationId: z.string(),
  typeId: z.string().optional(),
})

export const updateProjectSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  githubUrl: z.string().optional(),
  otherUrl: z.string().optional(),
  typeId: z.string().optional(),
})

// --- Helpers ---

async function checkProjectAccess(projectId: string, userId: string, roles: string[]) {
  const [proj] = await db.select().from(project).where(eq(project.id, projectId)).limit(1)
  if (!proj) throw new Error('Project not found')

  const [m] = await db
    .select()
    .from(member)
    .where(and(eq(member.organizationId, proj.organizationId), eq(member.userId, userId)))

  if (!m || !roles.includes(m.role)) {
    throw new Error('Unauthorized')
  }
  return { project: proj, member: m }
}

// --- Functions ---

export const getProjects = createServerFn({ method: 'GET' }).handler(async ({ data }) => {
  const organizationId = z.string().parse(data)
  return db
    .select({
      id: project.id,
      title: project.title,
      description: project.description,
      slug: project.slug,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      type: projectType.name,
      fileCount: sql<number>`count(${projectFile.id})::int`,
      ownerName: sql<string>`(select name from "user" where id = ${project.userId})`,
      ownerEmail: sql<string>`(select email from "user" where id = ${project.userId})`,
    })
    .from(project)
    .leftJoin(projectType, eq(project.typeId, projectType.id))
    .leftJoin(projectFile, eq(project.id, projectFile.projectId))
    .where(eq(project.organizationId, organizationId))
    .groupBy(project.id, projectType.name)
})

export const getProjectById = createServerFn({ method: 'GET' }).handler(async ({ data }) => {
  const projectId = z.string().parse(data)
  const [proj] = await db.select().from(project).where(eq(project.id, projectId)).limit(1)

  if (!proj) return null

  const files = await db.select().from(projectFile).where(eq(projectFile.projectId, projectId))
  const categories = await db
    .select()
    .from(projectCategory)
    .where(eq(projectCategory.projectId, projectId))

  return { ...proj, files, categories }
})

export const createProject = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  const request = getRequest()
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) throw new Error('Unauthorized')

  const validated = createProjectSchema.parse(data)
  const id = nanoid()
  const slug = validated.title.toLowerCase().replace(/ /g, '-') + '-' + nanoid(4)

  await db.insert(project).values({
    id,
    userId: session.user.id,
    organizationId: validated.organizationId,
    title: validated.title,
    description: validated.description || '',
    githubUrl: validated.githubUrl || null,
    otherUrl: validated.otherUrl || null,
    slug,
    typeId: validated.typeId,
  })

  // Seed default categories
  const defaultCategories = ['Dataset', 'Models', 'Results', 'Documentation']
  for (const catName of defaultCategories) {
    await db.insert(projectCategory).values({
      id: nanoid(),
      name: catName,
      projectId: id,
    })
  }

  return { id, slug }
})

export const updateProject = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  const { id, ...updates } = updateProjectSchema.parse(data)
  await db.update(project).set(updates).where(eq(project.id, id))
  return { success: true }
})

export const deleteProject = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  const { projectId, userId } = z.object({ projectId: z.string(), userId: z.string() }).parse(data)

  const { project: proj, member: m } = await checkProjectAccess(projectId, userId, [
    'owner',
    'admin',
  ])
  await db.delete(project).where(eq(project.id, projectId))
  return { success: true }
})

// --- Category Management ---

export const createCategory = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  const { projectId, name, parentId } = z
    .object({ projectId: z.string(), name: z.string(), parentId: z.string().optional() })
    .parse(data)

  const id = nanoid()
  await db.insert(projectCategory).values({
    id,
    projectId,
    name,
    parentId,
  })
  return { id }
})

// --- Labeling ---

export const bulkLabelFiles = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  const { fileIds, categoryId } = z
    .object({ fileIds: z.array(z.string()), categoryId: z.string().nullable() })
    .parse(data)

  await db.update(projectFile).set({ categoryId }).where(sql`${projectFile.id} IN ${fileIds}`)
  return { success: true }
})

// --- Project Types ---

export const getProjectTypes = createServerFn({ method: 'GET' }).handler(async ({ data }) => {
  const organizationId = z.string().parse(data)
  const types = await db
    .select()
    .from(projectType)
    .where(eq(projectType.organizationId, organizationId))

  if (types.length === 0) {
    const defaultTypes = ['THESE', 'STAGE', 'AUTRE']
    const seededTypes = []
    for (const name of defaultTypes) {
      const id = nanoid()
      await db.insert(projectType).values({ id, name, organizationId })
      seededTypes.push({ id, name, organizationId })
    }
    return seededTypes
  }

  return types
})

export const createProjectType = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  const { organizationId, name } = z
    .object({ organizationId: z.string(), name: z.string() })
    .parse(data)

  const id = nanoid()
  await db.insert(projectType).values({
    id,
    name,
    organizationId,
  })
  return { id }
})

export const linkProjectFile = createServerFn({ method: 'POST' }).handler(async ({ data }) => {
  const validated = z
    .object({
      projectId: z.string(),
      categoryId: z.string().nullable(),
      name: z.string(),
      path: z.string(),
      url: z.string(),
      mimeType: z.string(),
      size: z.number(),
      uploadedBy: z.string(),
    })
    .parse(data)

  const id = nanoid()
  await db.insert(projectFile).values({
    id,
    ...validated,
  })
  return { id }
})
