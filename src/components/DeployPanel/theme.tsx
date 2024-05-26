import { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts';
import { selectTheme } from '../../actions';

export const themeMap: Record<string, any> = {
  Dark: { quality: 'dark', url: 'assets/css/themes/remix-dark_tvx1s2.css' },
  Light: { quality: 'light', url: 'assets/css/themes/remix-light_powaqg.css' },
  Violet: { quality: 'light', url: 'assets/css/themes/remix-violet.css' },
  Unicorn: { quality: 'light', url: 'assets/css/themes/remix-unicorn.css' },
  Midcentury: {
    quality: 'light',
    url: 'assets/css/themes/remix-midcentury_hrzph3.css',
  },
  Black: { quality: 'dark', url: 'assets/css/themes/remix-black_undtds.css' },
  Candy: { quality: 'light', url: 'assets/css/themes/remix-candy_ikhg4m.css' },
  HackerOwl: { quality: 'dark', url: 'assets/css/themes/remix-hacker_owl.css' },
  Cerulean: {
    quality: 'light',
    url: 'assets/css/themes/bootstrap-cerulean.min.css',
  },
  Flatly: {
    quality: 'light',
    url: 'assets/css/themes/bootstrap-flatly.min.css',
  },
  Spacelab: {
    quality: 'light',
    url: 'assets/css/themes/bootstrap-spacelab.min.css',
  },
  Cyborg: {
    quality: 'dark',
    url: 'assets/css/themes/bootstrap-cyborg.min.css',
  },
};

export function ThemeUI() {
  const { appState } = useContext(AppContext);
  const { theme } = appState.instance;

  const themeList = Object.keys(themeMap);

  useEffect(() => {
    selectTheme(theme);
  }, []);

  return (
    <div className="d-block">
      <label>Themes</label>
      <div className="d-flex align-items-center">
        <select
          id="txorigin"
          data-id="runTabSelectAccount"
          name="txorigin"
          className="form-control overflow-hidden w-100 font-weight-normal custom-select pr-4"
          value={theme}
          onChange={(e) => {
            selectTheme(e.target.value);
          }}
        >
          {themeList.map((item) => (
            <option value={item} key={item}>
              {item} - {themeMap[item].quality}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
