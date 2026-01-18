import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="not-found-page h-100 d-flex flex-column align-items-center justify-content-center">
            <h1>{t('notFoundPage.title')}</h1>
            <p>
                <Trans i18nKey="notFoundPage.toMainPage">
                    <Link to="/">Вернуться на главную</Link>
                </Trans>
            </p>
        </div>
    );
};

export default NotFoundPage;