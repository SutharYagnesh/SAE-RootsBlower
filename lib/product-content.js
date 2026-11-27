function isHttpUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function isValidProductContent(documents, reviews) {
  const validDocuments =
    documents === undefined ||
    (Array.isArray(documents) &&
      documents.every(
        (document) =>
          document &&
          typeof document.title === 'string' &&
          document.title.trim() &&
          typeof document.url === 'string' &&
          isHttpUrl(document.url)
      ));
  const validReviews =
    reviews === undefined ||
    (Array.isArray(reviews) &&
      reviews.every(
        (review) =>
          review &&
          typeof review.author === 'string' &&
          review.author.trim() &&
          typeof review.reviewBody === 'string' &&
          review.reviewBody.trim() &&
          Number.isFinite(Number(review.ratingValue)) &&
          Number(review.ratingValue) >= 1 &&
          Number(review.ratingValue) <= 5 &&
          review.datePublished &&
          !Number.isNaN(new Date(review.datePublished).getTime())
      ));

  return validDocuments && validReviews;
}
