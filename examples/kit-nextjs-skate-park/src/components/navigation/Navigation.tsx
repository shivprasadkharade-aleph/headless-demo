'use client';
import React, { useState, useEffect, JSX } from 'react';
import { Link, LinkField, Text, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children: Array<Fields>;
  Styles: string[];
}

interface NavigationListItemProps {
  fields: Fields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
}

interface NavigationProps extends ComponentProps {
  fields: Fields;
}

const getTextContent = (fields: Fields): JSX.Element | string => {
  if (fields.NavigationTitle) return <Text field={fields.NavigationTitle} />;
  if (fields.Title) return <Text field={fields.Title} />;
  return fields.DisplayName;
};

const getLinkField = (fields: Fields): LinkField => ({
  value: {
    href: fields.Href,
    title:
      fields.NavigationTitle?.value?.toString() ??
      fields.Title?.value?.toString() ??
      fields.DisplayName,
    querystring: fields.Querystring,
  },
});

const NavigationListItem: React.FC<NavigationListItemProps> = ({
  fields,
  handleClick,
  relativeLevel,
}) => {
  const [isActive, setIsActive] = useState(false);
  const { page } = useSitecore();

  const classNames = [...fields.Styles, `rel-level${relativeLevel}`, isActive ? 'active' : ''].join(
    ' '
  );

  const hasChildren = fields.Children?.length > 0;
  const children = hasChildren
    ? fields.Children.map((fields, index) => (
        <NavigationListItem
          key={`${index}-${fields.Id}`}
          fields={fields}
          handleClick={handleClick}
          relativeLevel={relativeLevel + 1}
        />
      ))
    : null;

  return (
    <li className={classNames} key={fields.Id} tabIndex={0}>
      <div
        className={`navigation-title ${hasChildren ? 'child' : ''}`}
        onClick={() => setIsActive(!isActive)}
      >
        <Link field={getLinkField(fields)} editable={page.mode.isEditing} onClick={handleClick}>
          {getTextContent(fields)}
        </Link>
      </div>
      {hasChildren && <ul className="clearfix">{children}</ul>}
    </li>
  );
};

export const Default = ({ params, fields }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;

  // Determine current language on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isZh = window.location.pathname.startsWith('/zh-CN');
      setCurrentLang(isZh ? 'zh-CN' : 'en');
    }
  }, []);

  if (!Object.values(fields).length) {
    return (
      <div className={`component navigation ${styles}`} id={id}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, forceState?: boolean) => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }
    setIsMenuOpen(forceState ?? !isMenuOpen);
  };

  const handleLanguageClick = (e: React.MouseEvent<HTMLAnchorElement>, lang: 'en' | 'zh-CN') => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const search = window.location.search;
    const currentlyChinese = pathname.startsWith('/zh-CN');

    if (lang === 'zh-CN' && !currentlyChinese) {
      // Add prefix
      const newPath = pathname === '/' ? '' : pathname;
      window.location.href = `/zh-CN${newPath}${search}`;
    } else if (lang === 'en' && currentlyChinese) {
      // Remove prefix
      const newPath = pathname.replace('/zh-CN', '') || '/';
      window.location.href = `${newPath}${search}`;
    }
  };

  const navigationItems = Object.values(fields)
    .filter(Boolean)
    .map((item: Fields, index) => (
      <NavigationListItem
        key={`${index}-${item.Id}`}
        fields={item}
        handleClick={(event) => handleToggleMenu(event, false)}
        relativeLevel={1}
      />
    ));

  return (
    <div className={`component navigation ${styles}`} id={id}>
      
      {/* Plain HTML Language Switcher */}
      <div className="language-switcher">
        <a style={{padding:4,fontWeight:500,fontSize:16}}
          href="#" 
          className={`lang-link ${currentLang === 'en' ? 'active' : ''}`} 
          onClick={(e) => handleLanguageClick(e, 'en')}
        >
          EN 
        </a>
        <span className="separator">|</span>
        <a style={{padding:4,fontWeight:500,fontSize:16}}
          href="#" 
          className={`lang-link ${currentLang === 'zh-CN' ? 'active' : ''}`} 
          onClick={(e) => handleLanguageClick(e, 'zh-CN')}
        >
          中文
        </a>
      </div>

      <label className="menu-mobile-navigate-wrapper">
        <input
          type="checkbox"
          className="menu-mobile-navigate"
          checked={isMenuOpen}
          onChange={() => handleToggleMenu()}
        />
        <div className="menu-humburger" />
        <div className="component-content">
          <nav>
            <ul className="clearfix">{navigationItems}</ul>
          </nav>
        </div>
      </label>
    </div>
  );
};