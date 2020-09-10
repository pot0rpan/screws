import { UrlDbObjectType } from '../../types/url';
import { BASE_URL, WEBSITE_NAME } from '../../config';
import { useHttpClient } from '../../hooks/http-hook';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';

const Backup: React.FC = () => {
  const { isLoading, sendRequest, error, clearError } = useHttpClient();

  const handleDatabaseDownload = async () => {
    if (error) clearError();

    let data: { date: string; urls: UrlDbObjectType[] } | undefined;

    try {
      data = await sendRequest(`${BASE_URL}/api/admin/backup`);
    } catch (err) {
      console.log(err);
    }

    console.log(data);

    if (data?.date && data?.urls) {
      // Prompt for download
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute(
        'href',
        `data:application/json;charset=utf-8,${JSON.stringify(data)}`
      );
      downloadLink.setAttribute(
        'download',
        `${WEBSITE_NAME.toLowerCase()}-${data.date}.json`
      );

      document.body.append(downloadLink);

      downloadLink.click();

      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="backup">
      <p>
        <strong>
          Please use caution with these tools, it may be rough on the server
        </strong>
      </p>

      <div className="buttons">
        <Button primary={false} onClick={handleDatabaseDownload}>
          Download Backup
        </Button>
      </div>

      {isLoading && <LoadingSpinner asOverlay />}

      <style jsx>
        {`
          .backup {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: var(--danger);
            padding: 1rem;
            border: 1px solid var(--danger) 1px solid var(--danger);
          }
          .backup p {
            margin-top: 0;
          }
          .buttons {
            font-size: 0.8rem;
          }
        `}
      </style>
    </div>
  );
};

export default Backup;
