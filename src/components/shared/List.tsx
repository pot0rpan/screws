interface Props {
  items: { title: string; description: string }[];
  primary?: boolean;
}

const List: React.FC<Props> = ({ items, primary = true }) => {
  return (
    <ul>
      {items.map((itm) => (
        <li key={itm.title}>
          <b>{itm.title}</b>
          <span>{itm.description}</span>
        </li>
      ))}
      <style jsx>
        {`
          ul {
            display: flex;
            flex-direction: column;
            list-style: none;
            margin: 0;
            padding: 0;
            padding-bottom: 1rem;
          }
          li {
            display: flex;
            flex-direction: column;
            margin-left: 2rem;
            margin-top: 1rem;
            position: relative;
          }
          li::before {
            background: var(--${primary ? 'primary' : 'danger'});
            opacity: 0.8;
            content: '';
            height: 100%;
            left: -1rem;
            position: absolute;
            width: 0.2rem;
          }
          li b {
            margin-bottom: 0.25rem;
          }
        `}
      </style>
    </ul>
  );
};

export default List;
