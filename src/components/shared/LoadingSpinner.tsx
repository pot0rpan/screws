interface Props {
  asOverlay?: boolean;
  dimBackground?: boolean;
}

const LoadingSpinner: React.FC<Props> = ({
  asOverlay = false,
  dimBackground = false,
}) => {
  return (
    <div
      className={`${asOverlay && 'overlay'} ${
        dimBackground && 'dim-background'
      }`}
    >
      <div className="dual-ring" data-testid="loading-spinner"></div>
      <style jsx>
        {`
          .dual-ring {
            display: inline-block;
            height: 4rem;
            width: 4rem;
          }

          .dual-ring:after {
            animation: lds-dual-ring 1.2s linear infinite;
            border: 0.4rem solid var(--danger);
            border-color: var(--danger) transparent var(--danger) transparent;
            border-radius: 50%;
            content: ' ';
            display: block;
            height: 100%;
            margin: 1px;
            width: 100%;
          }

          .overlay {
            align-items: center;
            display: flex;
            height: 100%;
            justify-content: center;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
          }

          .overlay.dim-background {
            background: rgba(0, 0, 0, 0.4);
          }

          @keyframes lds-dual-ring {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
