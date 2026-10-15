import "./Skeletons.scss";

export const ProductCardSkeleton = ({ count = 4 }) => <div className="skeleton-product-grid" aria-label="Loading products" role="status">{Array.from({ length: count }, (_, index) => <div className="skeleton-product" key={index}><div className="skeleton-product__image"/><div className="skeleton-product__line"/><div className="skeleton-product__line skeleton-product__line--short"/><div className="skeleton-product__price"/></div>)}</div>;

export const SkeletonRows = ({ count = 4 }) => <div className="skeleton-rows" role="status" aria-label="Loading items">{Array.from({ length: count }, (_, index) => <div className="skeleton-rows__row" key={index}><i/><span><b/><b/></span></div>)}</div>;
