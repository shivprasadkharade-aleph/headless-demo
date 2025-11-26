import React, { JSX } from 'react';
import { ComponentParams, ComponentRendering, NextImage as ContentSdkImage, Link as ContentSdkLink, } from '@sitecore-content-sdk/nextjs';

interface BasicHeroProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: BasicHeroProps): JSX.Element => {
  console.log('Rendering BasicHero with props:', props);
  const id = props.params.RenderingIdentifier;
  const imagePath = props.fields.Image;
  const TitleText = props.fields.Title.value;
  const SubTitlText = props.fields.SubText.value;
  const CTALinkText = props.fields.Link;

  return (
    <div className="container-wrapper"><div className="component container-default col-12 container">
    <section className="hero">
    <div className="hero__media">
      <ContentSdkImage className="hero__img" field={imagePath} />
      <div className="hero__overlay"></div>
    </div>

    <div className="hero__content">
        <h1 className="hero__title hero__padding">{TitleText}</h1>

        <p className="hero__subtitle">
            {SubTitlText}
        </p>

        <div className="hero__cta">
            <ContentSdkLink className="btn" field={CTALinkText} />
            {/* <a className="btn" href="#">Get started</a> */}
            {/* <a className="btn--ghost" href="#">Learn more</a> */}
        </div>
    </div>
</section>
</div>
</div>
  );
};
