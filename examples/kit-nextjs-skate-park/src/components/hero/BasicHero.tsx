import React, {JSX} from 'react';
import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';

interface BasicHeroProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: BasicHeroProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <div className={`component ${props.params.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <p>BasicHero Component</p>
      </div>
    </div>
  );
};
