import "./Pagination.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const total = Math.max(1, Number(totalPages) || 1);
    if (total <= 1) return null;
    const pages = new Set([1, total]);
    for (let page = Math.max(1, currentPage - 1); page <= Math.min(total, currentPage + 1); page += 1) pages.add(page);
    const items = [...pages].sort((a, b) => a - b);
    const sequence = items.flatMap((page, index) => index && page - items[index - 1] > 1 ? ["ellipsis", page] : [page]);
    return <nav className="pagination" aria-label="Product pages">
        <button className="pagination__arrow" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page"><span aria-hidden="true">←</span><span className="pagination__word">Previous</span></button>
        <div className="pagination__pages">{sequence.map((item, index) => item === "ellipsis" ? <span className="pagination__ellipsis" key={`ellipsis-${index}`} aria-hidden="true">…</span> : <button key={item} onClick={() => onPageChange(item)} aria-label={`Page ${item}`} aria-current={item === currentPage ? "page" : undefined} className={item === currentPage ? "is-current" : ""}>{item}</button>)}</div>
        <button className="pagination__arrow" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= total} aria-label="Next page"><span className="pagination__word">Next</span><span aria-hidden="true">→</span></button>
    </nav>;
};
export default Pagination;
