/**
 * Slug generation utilities for production-safe URL creation
 * Ensures consistent, URL-safe, and unique slugs
 */

/**
 * Generate a URL-safe slug from a product name
 * Handles edge cases and ensures consistency
 */
export function generateSlug(name: string): string {
  if (!name || typeof name !== 'string') {
    throw new Error('Product name is required for slug generation');
  }

  // Convert to lowercase and trim
  const slug = name
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  if (slug.length === 0) {
    throw new Error('Product name must contain valid characters for slug generation');
  }

  return slug;
}

/**
 * Generate a unique slug by appending a number if the slug already exists
 * This should be used when creating new products
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  // Check if base slug exists
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Validate that a slug is URL-safe and properly formatted
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Must be lowercase, alphanumeric with hyphens only
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  
  return slugRegex.test(slug) && slug.length >= 1 && slug.length <= 100;
}

/**
 * Normalize a slug for consistent storage and comparison
 */
export function normalizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    return '';
  }

  return slug.toLowerCase().trim();
}
