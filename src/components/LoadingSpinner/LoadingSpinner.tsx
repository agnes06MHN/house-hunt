import './LoadingSpinner.scss';

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <svg viewBox="0 0 100 100" width={'20%'} height={'20%'}>
        <defs>
          <filter id="shadow">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="1.5"
              flood-color="#3096c2"
            />
          </filter>
        </defs>
        <circle
          className="loading-spinner__spinner"
          style={{
            fill: 'transparent',
            stroke: '#28799c',
            strokeWidth: '7px',
            strokeLinecap: 'round',
            filter: 'url(#shadow)',
          }}
          cx="50"
          cy="50"
          r="45"
        />
      </svg>
    </div>
  );
};
