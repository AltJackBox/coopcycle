package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Duration;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "delivery_time")
    private Duration deliveryTime;

    @JsonIgnoreProperties(value = { "course", "produits", "compte", "restaurant" }, allowSetters = true)
    @OneToOne(mappedBy = "course")
    private Panier panier;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Course id(Long id) {
        this.id = id;
        return this;
    }

    public Duration getDeliveryTime() {
        return this.deliveryTime;
    }

    public Course deliveryTime(Duration deliveryTime) {
        this.deliveryTime = deliveryTime;
        return this;
    }

    public void setDeliveryTime(Duration deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public Panier getPanier() {
        return this.panier;
    }

    public Course panier(Panier panier) {
        this.setPanier(panier);
        return this;
    }

    public void setPanier(Panier panier) {
        if (this.panier != null) {
            this.panier.setCourse(null);
        }
        if (panier != null) {
            panier.setCourse(this);
        }
        this.panier = panier;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course)) {
            return false;
        }
        return id != null && id.equals(((Course) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Course{" +
            "id=" + getId() +
            ", deliveryTime='" + getDeliveryTime() + "'" +
            "}";
    }
}
