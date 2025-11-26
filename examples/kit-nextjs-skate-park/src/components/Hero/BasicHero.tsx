import React, { JSX } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text,
} from '@sitecore-content-sdk/nextjs';

interface BasicHeroProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: BasicHeroProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  // Safely access fields (prevents crashes when fields are missing)
  const fields = props.rendering?.fields ?? {};

  return (
    <div className="container-wrapper">
      <div className="component container-default col-12 container">
        <section className="hero">
          <div className="hero__media">
            {fields.Image && (
              <ContentSdkImage
                className="hero__img"
                field={fields.Image}
                // Optional but recommended for hero images
                fill
                priority
                sizes="100vw"
              />
            )}
            <div className="hero__overlay"></div>
          </div>

          <div className="hero__content">
            <h1 className="hero__title hero__padding">
              <Text field={fields.Title} />
            </h1>

            <p className="hero__subtitle">
              <Text field={fields.SubText} />
            </p>

            <div className="hero__cta">
              {fields.Link && (
                <ContentSdkLink className="btn" field={fields.Link} />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};