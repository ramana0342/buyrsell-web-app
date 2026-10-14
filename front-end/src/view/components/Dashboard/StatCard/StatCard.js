import "./StatCard.scss";

const StatCard = ({
    title,
    value,
    icon,
    color
}) => {

    return (

        <div className="stat-card">

            <div
                className="stat-card__icon"
                style={{ background: color }}
            >
                {icon}
            </div>

            <div>

                <h4>{title}</h4>

                <h2>{value}</h2>

            </div>

        </div>

    );

};

export default StatCard;