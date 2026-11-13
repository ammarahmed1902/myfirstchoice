import { services } from "@/lib/services";
export function Services() {
  return (
    <div className="service-list">
      {services.map((service, i) => (
        <article key={service.title}>
          <span className="service-number">0{i + 1}</span>
          <div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
