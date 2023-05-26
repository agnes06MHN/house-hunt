import { useEffect, useState } from 'react';

type Props = {
  requestmarker?: boolean;
  isplace?: boolean;
  iscluster?: boolean;
};

export const SimpleMarker: React.FC<Props> = ({
  requestmarker,
  isplace,
  iscluster,
}) => {
  const [color, setColor] = useState<string>('#AAAAAAAA');

  useEffect(() => {
    if (isplace) {
      setColor('#28799c');
    }
    if (iscluster) {
      setColor('#9c3728');
    }
  }, [isplace, iscluster]);

  if (requestmarker) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <circle cx={8.5} cy={8.5} r={8.5} fill="#4890E8" fillOpacity={0.2} />
        <circle cx={8.5} cy={8.5} r={4} fill="#4890E8" stroke="#fff" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={46}
      height={46}
      fill="none"
      style={{ transform: 'translate(-50%, -100%)' }}
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M23 44.083s17.25-11.5 17.25-24.916a17.25 17.25 0 1 0-34.5 0C5.75 32.583 23 44.083 23 44.083Zm5.75-24.916a5.75 5.75 0 1 1-11.5 0 5.75 5.75 0 0 1 11.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
