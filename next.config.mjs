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
  // Plain <img> tags and CSS url()s don't get basePath applied automatically
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
