/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1]
const isGithubActions = process.env.GITHUB_ACTIONS === "true"
const isUserPagesRepo = repoName?.endsWith(".github.io")
const basePath =
  isGithubActions && repoName && !isUserPagesRepo ? `/${repoName}` : ""

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
}

export default nextConfig
