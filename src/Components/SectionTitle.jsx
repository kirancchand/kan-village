export default function SectionTitle({ chip, title, subtitle }) {
    return (
        <div className="sec-title">
        <div className="sec-chip">{chip}</div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
        <div className="sec-rule">
            <div className="sec-rule-dot" />
        </div>
        </div>
    );
}