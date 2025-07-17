import { ProfileLink } from './ProfileLink';
import { BackButton } from '../BackButton';

export const Header = () => {
  return (
    <header className="px-20 py-[17px] w-full flex justify-between items-center">
      <BackButton />
      <ProfileLink />
    </header>
  );
};
